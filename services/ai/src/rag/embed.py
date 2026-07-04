import os
from pathlib import Path
from langchain_core.embeddings import Embeddings
import faiss
import numpy as np
import json

class MockVoyageEmbeddings(Embeddings):
    """
    Mock implementation of Voyage AI embeddings for the Sprint 5 MVP
    to avoid requiring real API keys in the CI pipeline.
    """
    def __init__(self, dimension: int = 1024):
        self.dimension = dimension

    def embed_documents(self, texts: list[str]) -> list[list[float]]:
        # Generate stable mock embeddings based on text hash
        return [self.embed_query(t) for t in texts]

    def embed_query(self, text: str) -> list[float]:
        np.random.seed(hash(text) % (2**32))
        return np.random.rand(self.dimension).tolist()


def build_index():
    """Builds a local FAISS index for the starter corpus."""
    base_dir = Path(__file__).parent
    corpus_dir = base_dir / "corpus"
    
    texts = []
    metadata = []
    
    # Read files
    for file_path in corpus_dir.glob("*.txt"):
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
            # simple chunking by double newline
            chunks = [c.strip() for c in content.split("\n\n") if c.strip()]
            for i, chunk in enumerate(chunks):
                texts.append(chunk)
                jurisdiction = "us" if "hipaa" in file_path.name.lower() else "eu" if "gdpr" in file_path.name.lower() else "unknown"
                metadata.append({
                    "source": file_path.name,
                    "chunk_index": i,
                    "jurisdiction": jurisdiction
                })

    if not texts:
        print("No corpus files found.")
        return

    embeddings_model = MockVoyageEmbeddings()
    vectors = embeddings_model.embed_documents(texts)
    
    dimension = len(vectors[0])
    index = faiss.IndexFlatL2(dimension)
    index.add(np.array(vectors, dtype=np.float32))

    # Save index and metadata
    faiss.write_index(index, str(base_dir / "starter_index.faiss"))
    with open(base_dir / "starter_metadata.json", "w", encoding="utf-8") as f:
        json.dump({"texts": texts, "metadata": metadata}, f)
        
    print(f"Built index with {len(texts)} chunks.")

if __name__ == "__main__":
    build_index()
