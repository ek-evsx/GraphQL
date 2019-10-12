const graphql = require('graphql');

const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList } = graphql;

const Movies = require('../models/movie');
const Directors = require('../models/director');

const movies = [
    { id: "1", name: "Pulp Fiction", genre: "Crime", directorId: "1" },
    { id: "2", name: "1984", genre: "Sci-Fi", directorId: "2" },
    { id: "3", name: "V for vendetta", genre: "Sci-Fi-Triller", directorId: "3" },
    { id: "4", name: "The Hateful Eight", genre: "Crime", directorId: "1" },
    { id: "5", name: "Inglourious Basterds", genre: "Crime", directorId: "1" },

]

const directors = [
    { id: "1", name: "Quentin Tarantino", age: 55 }, 
    { id: "2", name: "Michael Radford", age: 72 },  
    { id: "3", name: "James McTeigue", age: 51 },
]

const MovieType = new GraphQLObjectType({
    name: 'Movie',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        director: {
            type: DirectorType, 
            resolve(parent, args){
                // return directors.find(director => director.id == parent.id);
                return Directors.findById(parent.directorId);
            }
        }
    }),
});

const DirectorType = new GraphQLObjectType({
    name: 'Director',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        movies: {
                type: new GraphQLList(MovieType), 
                resolve(parent, args){
                    // return movies.filter(movie => movie.directorId == parent.id);
                    return Movies.find({ directorId: parent.id });
            }
        }
    }),
});

const Query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        movie: {
            type: MovieType,
            args: { id: {type: GraphQLID } },
            resolve(parent, args) {
                // return movies.find(movie => movie.id == args.id);
                return Movies.findById(args.id);
            }
        },
        director: {
            type: DirectorType,
            args: { id: {type: GraphQLID } },
            resolve(parent, args) {
                // return directors.find(director => director.id == args.id);
                return Directors.findById(args.id);
            }
        },
        movies: {
            type: new GraphQLList(MovieType),
            resolve(parent, args) {
                // return movies;
                return Movies.find({});
            }
        },
        directors: {
            type: new GraphQLList(DirectorType),
            resolve(parent, args) {
                // return directors;
                return Directors.find({});
            }
        }
    },
});

module.exports =  new GraphQLSchema({
    query: Query,
});