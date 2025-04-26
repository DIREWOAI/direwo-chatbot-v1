from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from langchain_community.llms import HuggingFaceHub
from langchain.chains import LLMChain
from langchain_core.prompts import PromptTemplate
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Allow frontend to connect

# Set your Hugging Face API Key
API_KEY = os.getenv("HUGGINGFACEHUB_API_TOKEN")


llm = HuggingFaceHub(
    huggingfacehub_api_token=API_KEY,
    repo_id="google/flan-t5-small", 
    model_kwargs={"temperature": 0.5, "max_length": 200}
)

# Initialize PromptTemplate
template = """You are Jarviss, a helpful AI Assistant.
Answer the following question clearly and professionally:
{question}
"""
prompt = PromptTemplate(template=template, input_variables=["question"])

# Initialize LangChain LLMChain
chain = LLMChain(llm=llm, prompt=prompt)

# Routes
@app.route('/')
def home():
    return render_template('home.html')  # Make sure you have 'templates/home.html' file

@app.route('/ask', methods=['POST'])
def ask():
    data = request.json
    user_question = data.get('question')
    
    if not user_question:
        return jsonify({'error': 'No question provided'}), 400

    # Combine prompt and get LLM response
    response = chain.run({'question': user_question})  # <-- Correct way to pass variables

    return jsonify({'answer': response})

if __name__ == '__main__':
    app.run(port=5000, debug=True)
