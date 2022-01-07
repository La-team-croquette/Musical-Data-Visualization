import json


def main():
    # with open("../data/all_data.json") as f:
    with open("../data/formated_json.json") as f:
        all_data = json.load(f)

    nodes_links = {
        "nodes": [],
        "links": []
    }

    data = {}

    for d in all_data:
        key = (d['artistName'], d['trackName'])
        if key not in data:
            data[key] = {
                "listeners": [],
                "msTotal": 0,
                "endTimes": {},
                "genres": []
            }
        if d["listener"] not in data[key]["listeners"]:
            data[key]["listeners"].append(d["listener"])
            data[key]["msTotal"] += d["msPlayed"]
            data[key]["genres"].extend(d["genres"])
            data[key]["genres"] = list(set(data[key]["genres"]))

        if d["listener"] not in data[key]["endTimes"]:
            data[key]["endTimes"][d["listener"]] = []

        data[key]["endTimes"][d["listener"]].append(d["endTime"])

    for name in ("Tom", "Marion", "Victor"):
        nodes_links["nodes"].append({
            "id": name,
            "group": "1",
            "type": "user"
        })

    groups = {
        "Marion": 4,
        "Tom": 5,
        "Victor": 10
    }

    for k, v in data.items():
        if len(v["listeners"]) >= 2:
            g = 0
            for v_ in v["listeners"]:
                g += groups[v_]

            nodes_links["nodes"].append({
                "id": k[1],
                "artist": k[0],
                "group": g,
                "type": "music",
                "genres": v["genres"],
                "endTimes": v["endTimes"],
                "msTotal": v["msTotal"],
            })
            for name in v["listeners"]:
                nodes_links["links"].append({
                    "source": name,
                    "target": k[1],
                    "value": 1,
                    "listeners": len(v["listeners"])
                })

    with open('nodes_links.json', 'w') as outfile:
        json.dump(nodes_links, outfile)


if __name__ == '__main__':
    main()
