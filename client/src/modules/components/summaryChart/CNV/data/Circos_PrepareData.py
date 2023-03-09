#!/usr/bin/python 
""" Module/Script Description

This Module/Script can help users prepare data for NGCircos.

Copyright (c) 2019
This code is free software; you can redistribute it and/or modify it
under the terms of the BSD License (see the file COPYING included with
the distribution).
@status:  experimental
@version: $Revision$
"""

# ------------------------------------
# python modules
# usage: python Circos_PrepareData.py gain.txt > gain.json
# python Circos_PrepareData.py allGain.csv > allgain.json
# python Circos_PrepareData.py allLOH.csv > allloh.json
# python Circos_PrepareData.py allLoss.csv > allloss.json
# python Circos_PrepareData.py allUndetermined.csv > allundermined.json

# python Circos_PrepareData.py plcoGain.csv > plcogain.json
# python Circos_PrepareData.py plcoLOH.csv > plcoloh.json
# python Circos_PrepareData.py plcoLoss.csv > plcoloss.json
# python Circos_PrepareData.py plcoUndetermined.csv > plcoundermined.json

# python Circos_PrepareData.py UKGain.csv > UKgain.json
# python Circos_PrepareData.py UKLOH.csv > UKloh.json
# python Circos_PrepareData.py UKLoss.csv > UKloss.json
# python Circos_PrepareData.py UKUndetermined.csv > UKundermined.json
# ------------------------------------

import sys
import os
import copy
import json
# ------------------------------------
# constants
# ------------------------------------

# ------------------------------------
# Misc functions
# ------------------------------------

# ------------------------------------
# Classes
# ------------------------------------

# ------------------------------------
# Main
# ------------------------------------
chromelen = {
    "1": 248956422,"2": 242193529, "3": 198295559, "4": 190214555,
   "5": 181538259,  "6": 170805979, "7": 159345973,
   "8": 145138636, "9": 138394717,  "10": 133797422,
   "11": 135086622,   "12": 133275309, "13": 114364328,
   "14": 107043718, "15": 101991189, "16": 90338345,  "17": 83257441,
   "18": 80373285,"19": 58617616, "20": 64444167,   "21": 46709983,
   "22": 50818468,
  }
 
if __name__=="__main__":
    if len(sys.argv)==1:
        print("Usage: "+sys.argv[0]+" SCATTER/SNP/ARC/HEATMAP/LINE/HISTOGRAM/LINK/CNV/BUBBLE  SCATTER01.txt/SNP01.txt/ARC01.txt/HEATMAP01.txt/LINE01.txt/HISTOGRAM01.txt/LINK01.txt/CNV01.txt/BUBBLE01.txt > SCATTER01.js/SNP01.js/ARC01.js/HEATMAP01.js/LINE01.js/HISTOGRAM01.js/LINK01.js/CNV01.js/BUBBLE01.js")
    else:
        datatype=sys.argv[0]
        dataname=sys.argv[1]
        # Prepare data for json format (Figure.js).
        totalline = 0
        countline = 0
        with open(sys.argv[1]) as file:
            for line in file:
                totalline = totalline+1

        fh=open(sys.argv[1])
        ypos = 0
        print( "[")
        for line in fh:
            line=line.rstrip(os.linesep)
            if line[0]!="#": #Title line started with "#"
                line=line.split(",")
                chrome_len=chromelen.get(line[3][3:])
                xlen=int(line[6])/chrome_len
                xStart= int(line[4])/chrome_len
                ypos=ypos+0.1
                countline = countline +1
                if countline < totalline:
                    ancentry = "Null" if line[12] =="" else line[12]
                    #dataset, sampleId,computedGender,chromosome, beginGrch38,endGrch38,length,pArm,qArm,nSites,type,cf,ancestry
                    print( "{\"block_id\": \""+line[3][3:]+"\",\"dataset\": \""+line[0][0:4]+"\",\"sampleId\": \""+line[1]+"\", \"start\": \""+line[4]+"\", \"end\": \""+line[5]+"\",\"length\": \""+line[6]+"\",\"pArm\": \""+line[7]+"\", \"qArm\": \""+line[8]+"\",\"nSite\": \""+line[9]+"\",\"type\": \""+line[10]+"\",\"value\": \""+line[11]+"\", \"ancestry\": \""+ancentry+"\", \"sex\": \""+line[2]+"\", \"age\": \""+"Null"+"\", \"ypos\": \""+str(round(ypos,3))+"\", \"xstart\": \""+str(round(xStart,3))+"\", \"xlen\": \""+str(round(xlen,3))+"\"},")
                    #print( "  {\"block_id\": \""+line[0]+"\", \"start\": \""+line[1]+"\", \"end\": \""+line[2]+"\", \"value\": \""+line[3]+"\", \"ancestry\": \""+line[4]+"\", \"sex\": \""+line[5]+"\"},")
                #the last line should not ending with ,
                elif  countline == totalline :
                    #print( "  {\"block_id\": \""+line[0]+"\", \"start\": \""+line[1]+"\", \"end\": \""+line[2]+"\", \"value\": \""+line[3]+"\", \"ancestry\": \""+line[4]+"\", \"sex\": \""+line[5]+"\"}")
                    print( "{\"block_id\": \""+line[3][3:]+"\",\"dataset\": \""+line[0][0:4]+"\",\"sampleId\": \""+line[1]+"\", \"start\": \""+line[4]+"\", \"end\": \""+line[5]+"\",\"length\": \""+line[6]+"\",\"pArm\": \""+line[7]+"\", \"qArm\": \""+line[8]+"\",\"nSite\": \""+line[9]+"\",\"type\": \""+line[10]+"\",\"cf\": \""+line[11]+"\", \"ancestry\": \""+ancentry+"\", \"sex\": \""+line[2]+"\", \"age\": \""+"Null"+"\", \"ypos\": \""+str(round(ypos,3))+"\", \"xstart\": \""+str(round(xStart,3))+"\", \"xlen\": \""+str(round(xlen,3))+"\"}")
                  
        print( "]")
            
  