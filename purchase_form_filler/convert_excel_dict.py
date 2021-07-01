import csv

result = {}

f = open('lookupSheet.csv')
for line in f:
    line = line.split(',')
    key = line[1]
    value = line[0]
    result.update({key: value})

print(result)
