/* gcc example.c -o example $(pkg-config --cflags --libs libmongoc) */

#include <mongoc.h>
#include <stdio.h>
#include <stdlib.h>

int
main (int   argc,
      char *argv[])
{
  const char *filename;
  const char *collection_name;
  if (argc != 3) {
    fprintf (stderr, "usage: %s collection_name json_file\n", argv[0]);
    return 1;
  }
  collection_name = argv[1];
  filename = argv[2];
  
  mongoc_client_t *client;

  const char *uristr = "mongodb://localhost/";

  mongoc_init ();

  client = mongoc_client_new (uristr);

  if (!client) {
    fprintf (stderr, "Failed to parse URI.\n");
    return EXIT_FAILURE;
  }

  mongoc_collection_t *collection;
  const char *db = "htc";
  bson_error_t error;

  collection = mongoc_client_get_collection (client, db, collection_name);

  bson_json_reader_t *reader;
  bson_t *doc;
  bool success;
  int b;

  if (!(reader = bson_json_reader_new_from_file (filename, &error))) {
    fprintf (stderr, "Failed to open \"%s\": %s\n",
             filename, error.message);
    return 1;
  }
  doc = bson_new ();
  while ((b = bson_json_reader_read (reader, doc, &error))) {
    if (b < 0) {
      fprintf (stderr, "Error in json parsing:\n%s\n", error.message);
      abort ();
    }
    success = mongoc_collection_save (collection,
                                      doc, // const bson_t *document
                                      NULL, // write_concern
                                      &error);
    if (!success) {
      fprintf (stderr, "Error saving:\n%s\n", error.message);
      abort ();
    }
    bson_reinit (doc);
  }
  bson_json_reader_destroy (reader);
  bson_destroy (doc);

  mongoc_collection_destroy (collection);

  mongoc_client_destroy (client);

  return EXIT_SUCCESS;
}
