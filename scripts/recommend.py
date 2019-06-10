import sys
import json
import numpy as np
import random
import pandas as pd
from pymongo import MongoClient
import datetime as datetime
import collections
import math

MongoClient = MongoClient('mongodb://193.106.55.129:23777/')
db = MongoClient.Museek
evnetsIds = list(db.events.find({'startDate': {'$lt' : datetime.datetime.now()}}, {'_id' : 1, 'requests' : 1}))
bandsIds = list(db.users.find({'type': 'band', 'reviews.1': {'$exists': 'true'}}, {'_id': 1, 'reviews': 1}))

eventIdArr = []
bandIdArr = []
requestedBands = np.array(json.loads(sys.argv[1]))
#requestedBands = ['441776537198933.5']

for event in evnetsIds:
    eventIdArr.append(str(event['_id']))

for band in bandsIds:
    bandIdArr.append(str(band['_id']))

learningMat = pd.DataFrame(0, columns=eventIdArr, index=bandIdArr)


for band in bandsIds:
    reviews = band['reviews']
    for review in reviews:
        if 'eventId' in review:
            learningMat.at[str(band['_id']), str(review['eventId'])] = int(1)


randomEventId = str(random.random() * 100000000000000)
learningMat[randomEventId] = pd.Series(0, learningMat.index)
learningMat.fillna(0)

for requestedBand in requestedBands:
    learningMat.at[str(requestedBand), randomEventId] = 1

selected_event = learningMat[randomEventId]
movieslikeSelected = learningMat.corrwith(selected_event)
corr_table = pd.DataFrame(movieslikeSelected, columns=['Correlation'])
sorted_corr = corr_table.sort_values('Correlation', ascending=False).head(20)
sorted_corr = sorted_corr[sorted_corr['Correlation'] > 0.5]
recommendedBands = {}


# new

rotatedMat = learningMat.T
requestedBandsDataMat = rotatedMat[requestedBands]
requestedBandsDataMat.fillna(0)
for index, row in sorted_corr.iterrows():
    for eventObj in evnetsIds:
        if str(eventObj['_id']) == index:
            for reqInEvent in eventObj['requests']:
                if reqInEvent['band']['_id'] not in recommendedBands:
                    if reqInEvent['band']['_id'] in rotatedMat:
                        rawRecommendedBands = pd.DataFrame(requestedBandsDataMat.corrwith(rotatedMat[reqInEvent['band']['_id']]), columns=['Correlation'])
                        rawRecommendedBands = rawRecommendedBands[rawRecommendedBands['Correlation'] > 0]
                        recommendedBands[reqInEvent['band']['_id']] = math.sqrt((rawRecommendedBands['Correlation'].sum() / len(requestedBandsDataMat.T))**(1/len(requestedBandsDataMat.T)))

                    # endnew



#old
# for index, row in sorted_corr.iterrows():
#     for eventObj in evnetsIds:
#         if (str(eventObj['_id']) == row.name):
#             for reqInEvent in eventObj['requests']:
#                 if reqInEvent['band']['_id'] in recommendedBands:
#                     recommendedBands[reqInEvent['band']['_id']] += 1
#                 else:
#                     recommendedBands[reqInEvent['band']['_id']] = 1
#oldend

for requestedBand in requestedBands:
    recommendedBands.pop(requestedBand, None)

#new
for key, value in dict(recommendedBands).items():
    if value <= 0:
        del recommendedBands[key]
#new



recommendedBands = sorted_dict = collections.OrderedDict(sorted(recommendedBands.items(), key=lambda x: x[1], reverse=True))
print(json.dumps(recommendedBands))
