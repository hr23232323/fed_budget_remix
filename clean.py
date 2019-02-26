import pandas as pd
import numpy as np


def main():
	# Read Data
	df = pd.read_csv("outlays.csv", thousands=',')
	# Only keep relavent columns
	df = df[['Agency Name', 'Subfunction Title','2016']]
	# Group and sum
	df_grouped = df.groupby(['Agency Name','Subfunction Title']).agg({'2016':'sum'})

	# sort 
	df_sorted = df_grouped.sort_values('2016', ascending=False)
	
	# Threshold
	df_new = df_sorted[:50]

	print(df_new)


if __name__ == "__main__":
	main()