#define _GNU_SOURCE // see feature_test_macros docs
#include <stdio.h>
#include <string.h>
#include <stdlib.h>

int main( int argc, char *argv[] )  
{
  if( argc != 2 ) {
    printf("Usage: %s <file>\n", argv[0]);
    return 1;
  }
  FILE * f;
  long cat, file_id, feat_id, feat_freq;
  char *line = NULL;
  int offset;
  size_t line_size = 0;
  ssize_t read_len; //signed size_t
  char *features, *feature;
  
  f = fopen (argv[1], "r");
  if (f == NULL)
    exit(EXIT_FAILURE);

  while ((read_len = getline(&line, &line_size, f)) != -1) {
    sscanf(line, "%ld 0:%ld%n", &cat, &file_id, &offset); // %n gives the number of characters consumed so far
    printf("{\"_id\": %d, \"cat_id\": %d, \"features\": [", file_id, cat);
    features = line+offset;

    feature = strtok(features, " \n");
    while (1) {
      sscanf(feature, "%ld:%ld", &feat_id, &feat_freq);
      printf ("{\"feat_id\": %d, \"freq\": %d}", feat_id, feat_freq);
      feature = strtok (NULL, " \n");
      if (feature == NULL)
        break;
      else
        printf (", ");
    }
    printf("]}\n");
  }

  free(line);
  fclose(f);
  exit(EXIT_SUCCESS);
}
