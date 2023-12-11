from flask import Flask, jsonify, request
import redis
import json
import requests

app = Flask(__name__)
redis_client = redis.StrictRedis(host='localhost', port=6379, db=0)

@app.route('/inventory', methods=['GET'])
def show_inventory():
    items = redis_client.hgetall('items')
    inventory = {item.decode('utf-8'): count.decode('utf-8') for item, count in items.items()}
    return jsonify(inventory)

@app.route('/api/request/<item_name>', methods=['GET'])
def request_item(item_name):
    if redis_client.hexists('items', item_name):
        return jsonify({'status': 200, 'message': f'{item_name} is available'})
    else:
        external_api_url = f'https://example.com/api/items/{item_name}'
        response = requests.get(external_api_url)

        if response.status_code == 200:
            redis_client.hset('items', item_name, response.json()['availability'])
            return jsonify({'status': 200, 'message': f'{item_name} is now available'})
        else:
            return jsonify({'status': 404, 'message': f'{item_name} is needed'})

@app.route('/api/add/<item_name>', methods=['POST'])
def add_item(item_name):
    count = redis_client.hincrby('items', item_name, request.json.get('count', 1))

    return jsonify({'status': 200, 'message': f'{item_name} added to the database ({count} times)'})

@app.route('/characteristics/<item_name>', methods=['GET'])
def show_characteristics(item_name):
    characteristics_str = redis_client.hget(f'{item_name}_characteristics', 'characteristics')

    if characteristics_str:
        characteristics = json.loads(characteristics_str.decode('utf-8'))
        return jsonify({'status': 200, 'characteristics': characteristics})
    else:
        return jsonify({'status': 404, 'message': f'Characteristics not found for {item_name}'})

if __name__ == '__main__':
    app.run(debug=True)
