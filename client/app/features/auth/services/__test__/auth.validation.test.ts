import type { RegisterFormValues } from "../../types/auth.types";
import { allValid, isValidUsername, passwordsMatch, validate } from "../auth.validation";

describe('isValidUsername', ()=>{
    const testCases = [
        {
            input: "lo",
            expected: false,
            test: "below minimum valid length (less than 3 characters)"
        },
        {
            input: "jas",
            expected: true,
            test: "minimum valid length (3 characters)"
        },
        {
            input: "jason sy",
            expected: false,
            test: "contains a space"
        },
        {
            input: "wally!",
            expected: false,
            test: "contains special characters"
        },
        {
            input: "a_very_shi",
            expected: true,
            test: "contains underscore"
        },
        {
            input: "",
            expected: false,
            test: "empty string"
        },
        {
            input: "124145",
            expected: true,
            test: "only numbers"
        }
    ];

    for (const testCase of testCases){
        const actual = isValidUsername(testCase.input);
        test(
            `test: ${testCase.test}.\nExpected ${testCase.expected}\nActual: ${actual}`, 
            ()=>{
            expect(actual).toEqual(testCase.expected);
        });
    }
});

describe('isDlsuEmail', ()=>{
    const testCases = [
        {
            input: "jason_mark_sy@dlsu.edu.ph",
            expected: true,
            test: "valid dlsu email" 
        },
        {
            input: "",
            expected: false,
            test: "empty string" 
        },
        {
            input: "extri@gmail.com",
            expected: false,
            test: "uses a different domain" 
        },
        {
            input: "YEROSH@DLSU.EDU.PH",
            expected: true,
            test: "handles uppercase" 
        },
        {
            input: " Jimini@dlsu.edu.ph ",
            expected: true,
            test: "handles trailing whitespace" 
        },
        {
            input: "@dlsu.edu.ph",
            expected: false,
            test: "suffix only" 
        },
        {
            input: "hello@dlsu_edu_ph",
            expected: false,
            test: "incorrect separator (using _ instead of . for domain)" 
        }
    ];

    for (const testCase of testCases){
        const actual = isValidUsername(testCase.input);
        test(
            `test: ${testCase.test}.\nExpected ${testCase.expected}\nActual: ${actual}`, 
            ()=>{
            expect(actual).toEqual(testCase.expected);
        });
    }
});


describe('passwordsMatch', ()=>{
    const testCases = [
        {
            input: ["09166", "09166"],
            expected: true,
            test: "same passwords"
        },
        {
            input: ["09166", "09167"],
            expected: false,
            test: "different passwords"
        },
        {
            input: ["AAAAA", "aaaaa"],
            expected: false,
            test: "different capitalization"
        }
    ];

    for (const testCase of testCases){
        const actual = passwordsMatch(testCase.input[0], testCase.input[1]);
        test(
            `test: ${testCase.test}.\nExpected ${testCase.expected}\nActual: ${actual}`, 
            ()=>{
            expect(actual).toEqual(testCase.expected);
        });
    }
});
describe('validate', () => {
    const testCases = [
        {
            input: { 
                firstName: "Jason", 
                lastName: "Sy", 
                username: "jason_sy", 
                email: "jason@dlsu.edu.ph", 
                password: "password123", 
                confirmPassword: "password123", 
                role: "student" 
            },
            expected: { username: true, email: true, passwordMatch: true },
            test: "all fields valid"
        },
        {
            input: { 
                firstName: "J", 
                lastName: "S", 
                username: "jo", 
                email: "wrong@gmail.com", 
                password: "123", 
                confirmPassword: "456", 
                role: "student" 
            },
            expected: { username: false, email: false, passwordMatch: false },
            test: "all fields invalid (short username, non-DLSU email, mismatched password)"
        },
        {
            input: { 
                firstName: "Jason", 
                lastName: "Sy", 
                username: "jason_sy", 
                email: "jason@dlsu.edu.ph", 
                password: "password123", 
                confirmPassword: "mismatch", 
                role: "admin" 
            },
            expected: { username: true, email: true, passwordMatch: false },
            test: "valid credentials but password mismatch"
        },
        {
            input: { 
                firstName: "", 
                lastName: "", 
                username: "valid_user", 
                email: "test@dlsu.edu.ph", 
                password: "abc", 
                confirmPassword: "abc", 
                role: "faculty" 
            },
            expected: { username: true, email: true, passwordMatch: true },
            test: "validates even with empty name fields (since validate only checks user/email/pass)"
        }
    ];

    for (const testCase of testCases) {
        const actual = validate(testCase.input as RegisterFormValues);
        test(
            `test: ${testCase.test}.\nExpected ${JSON.stringify(testCase.expected)}\nActual: ${JSON.stringify(actual)}`, 
            () => {
                expect(actual).toEqual(testCase.expected);
            }
        );
    }
});

describe('allValid', () => {
    const testCases = [
        {
            input: { username: true, email: true, passwordMatch: true },
            expected: true,
            test: "returns true when all fields are true"
        },
        {
            input: { username: false, email: true, passwordMatch: true },
            expected: false,
            test: "returns false if at least one field is false (username)"
        },
        {
            input: { username: true, email: false, passwordMatch: true },
            expected: false,
            test: "returns false if at least one field is false (email)"
        },
        {
            input: { username: false, email: false, passwordMatch: false },
            expected: false,
            test: "returns false when all fields are false"
        }
    ];

    for (const testCase of testCases) {
        const actual = allValid(testCase.input);
        test(
            `test: ${testCase.test}.\nExpected ${testCase.expected}\nActual: ${actual}`, 
            () => {
                expect(actual).toEqual(testCase.expected);
            }
        );
    }
});