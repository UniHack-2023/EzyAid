from flask import Flask, jsonify, request
import redis
import json
import requests

app = Flask(__name__)
redis_client = redis.StrictRedis(host='localhost', port=6379, db=0)

@app.route('/inventory', methods=['GET'])
def show_inventory():
    items = redis_client.hgetall('items')
<<<<<<< HEAD:#app.py
    inventory = []
=======
    inventory = {item.decode('utf-8'): count.decode('utf-8') for item, count in items.items()}
    return jsonify(inventory)
>>>>>>> e7f55a8622cd1b08e5e02929e48b1342bda4de80:server.py

    for item, count in items.items():
        item_name = item.decode('utf-8')
        count = count.decode('utf-8')

        # Retrieve characteristics from the Redis hash
        characteristics_str = redis_client.hget(f'{item_name}_characteristics', 'characteristics')

        if characteristics_str:
            # Convert the JSON string back to a Python dictionary
            characteristics = json.loads(characteristics_str.decode('utf-8'))
            inventory.append({'item_name': item_name, **characteristics})
        else:
            inventory.append({'item_name': item_name, 'size': 0})  # Default to 0 if size not found

    return render_template('inventory.html', inventory=inventory)

@app.route('/api/add/<item_name>', methods=['POST'])
def add_item(item_name):
<<<<<<< HEAD:#app.py
    existing_count = redis_client.hget('items', item_name)

    if existing_count:
        existing_count = int(existing_count.decode('utf-8'))
        pairs_added = request.json.get('pairs', 0)
        new_count = existing_count + pairs_added
        redis_client.hset('items', item_name, new_count)
    else:
        new_count = 1
        redis_client.hset('items', item_name, new_count)

    characteristics = request.json

    # Extract 'size' from the characteristics and use it as the key
    size = characteristics.get('size', 0)
    characteristics[size] = characteristics.pop('size', 0)

    characteristics_str = json.dumps(characteristics)

    redis_client.hset(f'{item_name}_characteristics', size, characteristics_str)
=======
    count = redis_client.hincrby('items', item_name, request.json.get('count', 1))
>>>>>>> e7f55a8622cd1b08e5e02929e48b1342bda4de80:server.py

    return jsonify({'status': 200, 'message': f'{item_name} added to the database ({new_count} times)'})
    

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
