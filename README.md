# DataSource by Bocks

This repository contains the base image for all DataSource resources.

DataSource is built on [ApolloServer](https://www.apollographql.com/docs/apollo-server/) to deliver GraphQL.

----------

## Usage

By including this as the base image for a Dockerfile, the rest of the downstream repository needs to only contain three things, and a fourth file for configuration is optional. For our example below, we will place these elements in a directory called `app/`. Details for each of these will be in their own section here below.

**Required:**
- `json/`, `csv/`, or `tsv/` - Directory of files to be used in building the SQLite database. See conf var `dataType` for more on this.
- `associative_tables.js` - Provides a dict of table relationship defintions.
- `table_singulars.js` - Provides a dict of basic key:value pairs with table names and their singular form.

**Optional:**
- `conf.js` - Overwrite app configuration elements such as port and debug levels.

----------

## Running the Provided Example

On its own, this image runs with a subset of data pulled from _sf-datasource_- but that data should be overwritten at runtime by the downstream Dockerfile. 

The directory `code/app/` in this repository provides the example application should this repo's Dockerfile be run directly. It is built with the same structure that downstream applications should use.

----------

## Example Usage

### Dockerfile

Here is an example of the Dockerfile, taken from `sf-datasource`.

```
FROM bocks/datasource:0.2.3
RUN rm /code/app/json
COPY app /code/app
CMD node /code/index.js
```

Quick breakdown:

- `FROM` - Pulls this image from Docker Hub. Providing an explicit version is highly recommended.
- `RUN` - Removes the demo JSON content. Remove this line if you want to test with the demo data.
- `COPY` - Copy custom files to overwrite files from this directory.
- `CMD` - Initializes the DataSource node application

### app/json/

This is a flat directory which contains a separate file for each data table. These files can be easily created by exporting a spreadsheet as CSV and using any generic CSV to JSON converter to parse the data.

See detailed examples in this repository under `code/app/json/`.

Things to consider...

- **File Name** - The file name for each json entry will be used as the table name when the database is built. As such, this will be the value for your table name in `associative_tables.js` and `table_singulars.js`.
- **Data Types** - Data types will be inferred from columns. Null values are acceptable, but ensure that you do not mix data types (this may not currently return a verbose error message).
- **Limited nulls** - A column can not be entirely nullified at this time. At least one value in each column must have a value, or an error will occur. (this may not currently return a verbose error message).


### app/associative_tables.js

This file is a nodejs module, and has a simple (but specific) format. You can see a functional example in `code/app/associative_tables.js`.

The base format is: `module.exports = {}`, which allows our NodeJS application to easily read the contents of this file as an object. We'll add elements to that object as needed. 


**Indirect Relationships**

It is common for tables to reference a single object from another table by including a _foreign key_ to reference the _primary key_ of another table. The standard in our DataSource logic is to name the foriegn key according to the table name it references: `<TABLE>_id`.

In our example database, the table `class_features` has a foreign key column titled `classes_id`. This will reference a single id on the table `classes`. By default, DataSource assumes that relationships are _indirect_, such as in the case of `class_features`.

In our final GraphQL product, we want `classes` to have `class_features` nested within each result. This is an indirect relationship, because the `classes` table doesn't actually know about it's association to `class_features`. By creating this indirect relationship in DataSource, we tell GraphQL to look up `class_features` according to the id of each class and nest the corresponding `ClassFeature` into the `Class` results.

Here is how we will tell our DataSource app about this association:
```
module.exports = {
    class_features: {
        model_name: "ClassFeature",
        supported_tables: ['classes'],
    },
    ...
}
```


**Direct Relationships**

In opposition to the indirect relationships discussed above, direct relationships are specified in the table that relies on them. Their foreign keys will be handled the same as above, but the difference is in the association.

In our previous example, we nested class features within classes based on the foreign key in class_features. But classes has some foreign keys of it's own. For example, `classes` has the column `effect_ranges_id` which references the table `effect_ranges`. In this case, we want to grab a single effect range and nest it in classes.

Here is how we will tell our DataSource app about this association:
```
module.exports = {
    effect_ranges: {
        model_name: "EffectRange",
        supported_tables: ['spells'],
        direct: true,
    },
    ...
}
```

By adding `direct: true`, we are telling DataSource that effect_ranges supports spells, but the foriegn key lives in the spells table (unlike in our indirect relationships).


**Junction Relationships**

In our example, we have a junction table between the tables `spells` and `descriptors`, named `spell_descriptors`. This junction table has the columns `spells_id` and `descriptors_id`, which each contain integers that match the `id` column from `spells` and `descriptors`. You can see that in `code/app/json/spell_descriptors.json`.

Here is how we will tell our DataSource app about this association:
```
module.exports = {
    spell_descriptors: {
        model_name: "Descriptor",
        junction_target: 'descriptors',
        supported_tables: ['spells'],
    },
    ...
}
```

As you can see, this uses the additional value `junction_target`, which tells DataSource that this is a junction table, and where it should get its final data from.

Similar to indirect associations, this relationship results in a `Descriptor` object being nested within `spells`

Unlike our other relationship associations, this entry should have only one value for `supported_tables` (it remains a list simply for the sake of type consistency).

_Note: If `junction_target` is provided, `direct: true` will be ignored._


### app/table_singulars.js

DataSource needs to know what to call individual objects that are returned from your tables. Similar to `associative_tables.js`, this will be a module that exports an object that contains all necessary data.

By definition, this **does not include junction tables** because those return objects from another table. It does, however, include associative tables that return their own object. In our example `spell_descriptors` will not be included in the singulars, but `class_features` will be.

Here is how we will tell our DataSource app about these table singulars:
```
module.exports = {
    "class_features": "ClassFeature",
    ...
}
```


----------

## Optional Configuration Variables - app/config.js

As mentioned above, a fourth file can optionally be added to your app that controls config options.

See `code/app/config.js` for an example of this file.

Optional Values:

- `dataType` - Specifies the file extension and directory name of data files.
- `debugLevel ` - Value 0 sets the lowest verbosity; 4 is highest. `-616` will log full typeDefs and resolvers
- `port` - Override the default port for the API
- `preciceDebugLevel` - true/false, limit verbosity to an exact level while ignoring lower levels
- `subDebugLevels` - Same as `debugLevel`, but overrides subsets within the logs.
- `sentryDsn` - Data Source Name used to connect Sentry.io

Default values are as follows:
```
dataType: 'json',
debugLevel: 0,
port: 80,
preciceDebugLevel: false,
subDebugLevels: {
    database: 0,
    definitions: 0,
    resolvers: 0,
}
sentryDsn: undefined
```


----------
