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
# ------------------------------------

import sys
import os
import copy

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

if __name__=="__main__":
    if len(sys.argv)==1:
        print("Usage: "+sys.argv[0]+" SCATTER/SNP/ARC/HEATMAP/LINE/HISTOGRAM/LINK/CNV/BUBBLE  SCATTER01.txt/SNP01.txt/ARC01.txt/HEATMAP01.txt/LINE01.txt/HISTOGRAM01.txt/LINK01.txt/CNV01.txt/BUBBLE01.txt > SCATTER01.js/SNP01.js/ARC01.js/HEATMAP01.js/LINE01.js/HISTOGRAM01.js/LINK01.js/CNV01.js/BUBBLE01.js")
    else:
        datatype=sys.argv[0]
        dataname=sys.argv[1]
        # Prepare data for json format (Figure.js).
        totalline = 0
        countline = 0
        ypos = 0
        with open(sys.argv[1]) as file:
            for line in file:
                totalline = totalline+1

        fh=open(sys.argv[1])

        print( "[")
        for line in fh:
            line=line.rstrip(os.linesep)
            print(line)
            if line[0]!="#": #Title line started with "#"
                line=line.split("\t")
                countline = countline +1
                ypos= ypos+0.01
                print(ypos)
                value = line[3]
                if countline < totalline:
                    print( "  {\"block_id\": \""+line[0]+"\", \"start\": \""+line[1]+"\", \"end\": \""+line[2]+"\", \"value\": \""+line[3]+"\", \"ancestry\": \""+line[4]+"\", \"sex\": \""+line[5]+"\", \"age\": \""+"Null"+"\", \"ypos\": \""+ypos+"\"},")
                #the last line should not ending with ,
                elif  countline == totalline:
                    print( "  {\"block_id\": \""+line[0]+"\", \"start\": \""+line[1]+"\", \"end\": \""+line[2]+"\", \"value\": \""+line[3]+"\", \"ancestry\": \""+line[4]+"\", \"sex\": \""+line[5]+"\", \"age\": \""+"Null"+"\", \"ypos\": \""+ypos+"\"}")

        print( "]")
            
  