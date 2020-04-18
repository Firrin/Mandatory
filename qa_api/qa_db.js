class Db {

    constructor(mongoose){
        const qaSchema = new mongoose.Schema({
            question: String,
            answers: [
                {text: String,
                 votes: Number
                }
            ]
        })
        this.qaModel = mongoose.model("question", qaSchema)

    }
    async getQuestions(){
        try {
                return await this.qaModel.find({})
        } catch (error){
            console.error("getQuestion", error.message)
            return  {}
        }
    }

    async getQuestion(id){
        try{
            return await this.qaModel.findById(id);

        }catch (error){
            console.error("getQuestion:", error.message)
            return {}
        }
    }
    async createQuestion(newquestion){
        let question = new this.qaModel(newquestion)
        return await question.save()
    }
    async addAnswer(id, answer){
        const question = await this.getQuestion(id)
        answer.votes = 0;
        question.answers.push(answer)

        try{
            return question.save()
        }catch (error){
            console.error("addAnswer", error.message)
            return {}
        }
    }
    getAnswer(question, answerId){
        try {
            return question.answers.find(answer => answer._id == answerId)
        }catch (error) {
            console.error("getAnswer", error.message)
            return {}

        }
    }

 async vote(id, answerId){
        const question = await this.getQuestion(id)
        const answer = this.getAnswer(question, answerId)
        answer.votes = answer.votes +1;
        return question.save()
    }
    /**
     * This method adds a bunch of test data if the database is empty.
     * @param count The amount of questions to add.
     * @returns {Promise} Resolves when everything has been saved.
     */
    async bootstrap(count = 10) {
        const answers = [
            { text: "Answer 1", votes: 0 },
            { text: "Answer 2", votes: 3 },
            { text: "Answer 3", votes: 6 }
        ];
        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        }

        function getRandomName() {
            return [
                "First random question",
                "Second random question",
                "Third random question",
                "Fourth random question"
            ][getRandomInt(0, 3)];
        }

        function getRandomAnswers() {
            const shuffled = answers.sort(() => 0.5 - Math.random());
            return shuffled.slice(0, getRandomInt(1, shuffled.length));
        }

        let l = (await this.getQuestions()).length;
        console.log("question collection size:", l);

        if (l === 0) {
            let promises = [];

            for (let i = 0; i < count; i++) {
                let question = new this.qaModel({
                    question: getRandomName(),
                    answers: getRandomAnswers()
                });
                promises.push(question.save());
            }

            return Promise.all(promises);
        }
    }
}

// We export the object used to access the questions in the database
module.exports = mongoose => new Db(mongoose);