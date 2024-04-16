import json
import os
from tqdm import tqdm, trange
#set utf-8 to regonize the chinese characters

def split_json_by_event_date(input_file):
    with open(input_file, 'r', encoding="utf-8") as f:
        data = json.load(f)

    records_by_date = {}
    for record in tqdm(data['RECORDS']):

        #if any key is missing, the code will skip this record
        if ("Sub_Lib" not in record
                or "Department"not in record
                or "EventDate"not in record
                or "EventTime"not in record
                or "ID_type" not in record):
            continue
        #if any value is "", the code will skip this record
        if (record["EventDate"] == ""
                or not(type(record["EventDate"]) == str)
                or record["EventTime"] == ""
                or not(type(record["EventTime"]) == str)):
            continue
        event_date = record['EventDate']
        if event_date not in records_by_date:
            records_by_date[event_date] = []
        records_by_date[event_date].append(record)

    for event_date, records in records_by_date.items():
        #replace the "/" with "_"
        event_date = event_date.replace("/", "_")
        output_file = f"../data/split_json/{event_date}.json"
        #save the records to the output file
        #create a json file
        with open(output_file, 'w', encoding="utf-8") as f2:
            json.dump(records, f2, ensure_ascii=False, indent=4)

input_file = '../data/02-2023年全年入馆数据.json'
split_json_by_event_date(input_file)
