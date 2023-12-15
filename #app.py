from flask import Flask, jsonify, request, render_template
import redis
import json

app = Flask(__name__)
redis_client = redis.StrictRedis(host='localhost', port=6379, db=0)

@app.route('/', methods=['GET'])
def show_inventory():
    items = redis_client.hgetall('items')
    inventory = []

    for item, count in items.items():
        item_name = item.decode('utf-8')
        count = count.decode('utf-8')

        # Retrieve characteristics from the Redis list
        size = request.args.get('size', 'default_size')
        characteristics_list = redis_client.lrange(f'{item_name}_characteristics_{size}', 0, -1)

        if characteristics_list:
            # Convert the JSON string back to a Python list
            characteristics = [json.loads(char_str.decode('utf-8')) for char_str in characteristics_list]
            inventory.append({'item_name': item_name, 'count': count, 'characteristics': characteristics})
        else:
            inventory.append({'item_name': item_name, 'count': count, 'characteristics': []})

    return render_template('inventory.html', inventory=inventory)

@app.route('/api/add/<item_name>', methods=['POST'])
def add_item(item_name):
    size = request.json.get('size', 'default_size')  # Use 'default_size' if 'size' field is not present
    existing_key = f'{item_name}_{size}'

    existing_count = redis_client.hget('items', existing_key)

    if existing_count:
        existing_count = int(existing_count.decode('utf-8'))
        pairs_added = request.json.get('pairs', 0)
        new_count = existing_count + pairs_added
        redis_client.hset('items', existing_key, new_count)
    else:
        pairs_added = request.json.get('pairs', 1)  # Default to 1 if 'pairs' field not present
        new_count = pairs_added
        redis_client.hset('items', existing_key, new_count)

    characteristics = request.json

    # Extract 'size' from the characteristics and use it as the key
    characteristics[size] = characteristics.pop('size', 'default_size')

    characteristics_str = json.dumps(characteristics)

    # Use a list to store characteristics for each size
    redis_client.rpush(f'{item_name}_characteristics_{size}', characteristics_str)

    return jsonify({'status': 200, 'message': f'{item_name} added to the database ({new_count} times)'})

@app.route('/inventory', methods=['GET'])
def show_all_inventory():
    items = redis_client.hgetall('items')
    inventory = []

    for item, count in items.items():
        item_name = item.decode('utf-8')
        count = count.decode('utf-8')

        # Retrieve characteristics for each size from the Redis list
        characteristics_sizes = redis_client.keys(f'*_characteristics_*')
        characteristics = {}

        for size_key in characteristics_sizes:
            size = size_key.decode('utf-8').rsplit('_', 1)[-1]
            characteristics_list = redis_client.lrange(size_key, 0, -1)

            if characteristics_list:
                # Show only the size, not all characteristics
                characteristics[size] = True
            else:
                # No characteristics for this size
                characteristics[size] = False

        inventory.append({'item_name': item_name, 'count': count, 'characteristics': characteristics})

    return jsonify({'status': 200, 'inventory': inventory})




@app.route('/characteristics/<item_name>', methods=['GET'])
def show_characteristics(item_name):
    # Retrieve characteristics from the Redis list
    size = request.args.get('size', 'default_size')
    characteristics_list = redis_client.lrange(f'{item_name}_characteristics_{size}', 0, -1)

    if characteristics_list:
        # Convert the JSON string back to a Python list
        characteristics = [json.loads(char_str.decode('utf-8')) for char_str in characteristics_list]
        return jsonify({'status': 200, 'characteristics': characteristics})
    else:
        return jsonify({'status': 404, 'message': f'Characteristics not found for {item_name}'})
@app.route('/api/add-multiple', methods=['POST'])
def add_multiple_items():
    try:
        data = request.get_json()
        items = data.get('items', [])

        for item in items:
            item_name = item.get('item_name')
            size = item.get('size', 'default_size')
            pairs = item.get('pairs', 1)
            color = item.get('color', 'default_color')
            material = item.get('material', 'default_material')

            existing_key = f'{item_name}_{size}'
            existing_count = redis_client.hget('items', existing_key)

            if existing_count:
                existing_count = int(existing_count.decode('utf-8'))
                new_count = existing_count + pairs
                redis_client.hset('items', existing_key, new_count)
            else:
                new_count = pairs
                redis_client.hset('items', existing_key, new_count)

            characteristics = {'size': size, 'color': color, 'material': material}
            characteristics_str = json.dumps(characteristics)

            # Use a list to store characteristics for each size
            redis_client.rpush(f'{item_name}_characteristics_{size}', characteristics_str)

        return jsonify({'status': 200, 'message': 'Items added successfully'})
    except Exception as e:
        return jsonify({'status': 500, 'error': str(e)})
       

if __name__ == '__main__':
    app.run(debug=True)
