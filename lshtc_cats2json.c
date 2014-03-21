#define _GNU_SOURCE // see feature_test_macros docs
#include <stdio.h>
#include <string.h>
#include <stdlib.h>

int main( int argc, char *argv[] )  
{
  if( argc != 2 ) {
    printf("Usage: %s <cat_heir_file>\n", argv[0]);
    return 1;
  }
  FILE * f;
  long cat_heir[5];
  int i, heir_ht;
  char *line = NULL;
  size_t line_size = 0;
  ssize_t read_len; //signed size_t
  char *cat;
  
  f = fopen (argv[1], "r");
  if (f == NULL)
    exit(EXIT_FAILURE);

  while ((read_len = getline(&line, &line_size, f)) != -1) {
    heir_ht = 0;
    cat = strtok(line, " \n");
    while (cat != NULL) {
      cat_heir[heir_ht++] = atol(cat);
      cat = strtok (NULL, " \n");
    }
    printf("{\"dfs\": [%d", cat_heir[0]);
    for (i=1; i<heir_ht; i++)
      printf(", %d", cat_heir[i]);
    printf("]}\n");
  }

  free(line);
  fclose(f);
  exit(EXIT_SUCCESS);
}
