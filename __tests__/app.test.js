process.env.NODE_ENV = "test"
const app = require("../app")
const request = require("supertest")
const connection = require("../db/connection");

describe("/api", () => {


    afterAll(() => {
        return connection.destroy()
    })
    beforeEach(() => {
        return connection.seed.run()
    })
    describe("testing the topics api", () => {

   
    it("responds with a 200 ok", () => {
        return request(app)
            .get("/api/topics")
            .expect(200)
            .then((res) => {
                expect(res.body.topics).toEqual(expect.any(Array));
                expect(Object.keys(res.body.topics[0])).toEqual
                    (expect.arrayContaining(["slug", "description"]))            
        })
    })

        
 }) 
    describe("/missingRoute", () => {
        it("status 404 - All methods", () => {
            const allMethods = ["get", "post", "delete", "patch", "put"]
            const methodPromises = allMethods.map((method) => {
                return request(app)
                [method]("/missingRoute")
                    .expect(404)
                    .then(({ body }) => {
                    expect(body.msg).toBe("Route not found")
                })
            })
            return Promise.all(methodPromises)
        })
    })



});