import json
from pathlib import Path

import faiss
import numpy as np

from src.rag.embed import MockVoyageEmbeddings


class Retriever:
    def __init__(self) -> None:
        base_dir = Path(__file__).parent
        self.index_path = base_dir / "starter_index.faiss"
        self.metadata_path = base_dir / "starter_metadata.json"

        if not self.index_path.exists():
            raise FileNotFoundError("FAISS index not found. Run embed.py first.")

        self.index = faiss.read_index(str(self.index_path))
        with open(self.metadata_path, encoding="utf-8") as f:
            data = json.load(f)
            self.texts = data["texts"]
            self.metadata = data["metadata"]

        self.embeddings = MockVoyageEmbeddings()

    def retrieve(self, query: str, jurisdiction: str | None = None, top_k: int = 3) -> list[dict[str, str | float | dict[str, str | int]]]:
        """
        Jurisdiction-scoped retrieval, limited to the fields present in a given draft.
        """
        vector = self.embeddings.embed_query(query)
        distances, indices = self.index.search(np.array([vector], dtype=np.float32), k=top_k * 2)

        results = []
        for i in range(len(indices[0])):
            idx = indices[0][i]
            if idx == -1:
                continue

            meta = self.metadata[idx]

            # Jurisdiction scoping
            if jurisdiction and meta.get("jurisdiction") != jurisdiction:
                # If jurisdiction doesn't match and isn't unknown, skip
                if meta.get("jurisdiction") != "unknown":
                    continue

            results.append({
                "text": self.texts[idx],
                "metadata": meta,
                "score": float(distances[0][i])
            })

            if len(results) >= top_k:
                break

        return results

def get_retriever() -> Retriever:
    return Retriever()
