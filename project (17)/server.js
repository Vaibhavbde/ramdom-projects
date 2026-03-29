const { buildSchema } = require('graphql');
const express = require('express');
const { graphqlHTTP } = require('express-graphql');

const schema = buildSchema(`
    type Query {
        rollDice(numDice: Int!, numSides: Int): [Int]
    }
`);

const schema2 = buildSchema(`
    type Query {
        name: String,
        age: Int!,
        jobs: [String]
    }
`);

const schema3 = buildSchema(`
    type Query {
        rollDice(numDice: Int!, diceSides: Int): [Int]
    }
`);

const objectTypeSchema = buildSchema(`
    type RandomDie {
        numSides: Int!,
        rollOnce: Int!,
        roll(numRolls: Int!): [Int]
    }
    type Query {
        getDie(numSides: Int): RandomDie
    }
`);

class RandomDie{
    constructor(numSides){
        this.numSides = numSides;
    }

    rollOnce(){
        return 1 + Math.floor(Math.random() * this.numSides);
    }

    roll({ numRolls }){
        var output = [];
        for (var i = 0; i < numRolls; i++) {
          output.push(this.rollOnce());
        }
        return output;
    }
}

const objectTypeRootValue = {
    getDie: ({ numSides }) => {
        return new RandomDie(numSides);
    }
}

const rootValue = {
    hello: () => {
        return "Hello World"
    },
    course: () => {
        return "Graphql"
    }
};

const rootValue2 = {
    name: () => {
        return "Rizwan Khan"
    },
    age: () => {
        return 27
    },
    jobs: () => {
        return ["UIUX", "Engineer", "Artist"]
    }
}

const rootValue3 = {
    rollDice: ({ numDice, diceSides }) => {
        const resp = [];
        for(let i=0; i< numDice; i++){
            resp.push( 1 + Math.floor(Math.random() * (diceSides || 6)) );
        }

        return resp;
    }
}


// Mutations and Input Types
// ex 1
const mutationAndInputTypeEg1Schema = buildSchema(`
    type Mutation {
        setMessage(message: String): String
    }

    type Query {
        getMessage: String
    }
`);

const mutationAndInputTypeEg2Schema = buildSchema(`
    input MessageInput {
        content: String,
        author: String
    }

    type Message {
        id: ID!,
        content: String,
        author: String
    }

    type Query {
        getMessage(id: ID!): Message
    }

    type Mutation {
        createMessage(input: MessageInput): Message,
        updateMessage(id: ID!, input: MessageInput): Message
    }

`);

const mutationAndInputTypeEg2RootValue = {
    getMessage: ({ id }) => {

    },
    createMessage: ({ input }) => {

    },
    updateMessage: ({ id, input }) => {

    }
}

const app = express();
app.use(`/graphql`, graphqlHTTP({
    schema: objectTypeSchema,
    rootValue: objectTypeRootValue,
    graphiql: true
}));



app.listen(4000);

console.log('Running a GraphQL API server at http://localhost:4000/graphql');


// graphql({
//     schema,
//     source: `{ test }`,
//     rootValue
// })
// .then(response => {
//     console.log(response)
// });