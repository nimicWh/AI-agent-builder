from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class Agent(BaseModel):
    name: str
    nodes: list
    edges: list

@app.post("/save_agent")
def save_agent(agent: Agent):
    with open(f"{agent.name}.json", "w") as f:
        json.dump(agent.dict(), f, indent=2)
    return {"status": "saved"}

@app.post("/run_agent")
def run_agent(agent: Agent):
    # VERY simple mock execution
    result = "Agent Execution:\n"
    for node in agent.nodes:
        result += f"- {node['type']}: {node.get('data','')}\n"
    return {"result": result}
