from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from huggingface_hub import InferenceClient
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

HUGGINGFACEHUB_API_TOKEN = os.getenv("HUGGINGFACEHUB_API_TOKEN")

client = InferenceClient(
    token=HUGGINGFACEHUB_API_TOKEN
)

MODEL_NAME = "meta-llama/Meta-Llama-3-8B-Instruct"

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/ask', methods=['POST'])
def ask():
    try:
        data = request.json
        user_question = data.get('question', '')

        messages = [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": user_question}
        ]
        response = client.chat_completion(
                    model="tiiuae/falcon-7b-instruct",
                    messages=messages,
                    max_tokens=200,
                    temperature=0.7
)


        # Huggingface client.chat_completion returns a dictionary
        final_output = response.choices[0].message["content"]

        return jsonify({'answer': final_output})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
