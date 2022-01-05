import json


def main():
    with open("../data/all_data.json") as f:
        all_data = json.load(f)

    nodes_links = {
        "nodes": [],
        "links": []
    }

    data = {}

    for d in all_data:
        key = (d['artistName'], d['trackName'])
        if key not in data:
            data[key] = []
        if d["listener"] not in data[key]:
            data[key].append(d["listener"])

    for name in ("Tom", "Marion", "Victor"):
        nodes_links["nodes"].append({
            "id": name,
            "group": "1",
            "type": "user",
            "size": 15,
            "force": -500
        })

    groups = {
        "Marion": 4,
        "Tom": 5,
        "Victor": 10
    }

    for k, v in data.items():
        if len(v) >= 2:
            g = 0
            for v_ in v:
                g += groups[v_]
            nodes_links["nodes"].append({
                "id": k[1],
                "artist": k[0],
                "group": g,
                "type": "music",
                "size": 5,
                "force": -10,
            })
            for name in v:
                nodes_links["links"].append({
                    "source": name,
                    "target": k[1],
                    "value": 1
                })

    with open('nodes_links.json', 'w') as outfile:
        json.dump(nodes_links, outfile)


if __name__ == '__main__':
    main()
