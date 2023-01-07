import test from "node:test";
import { checkElementAttributeByOne } from "./element";
import { ELEMENT_ATTRIBUTE, ATTRIBUTE_TYPE } from "../interface";

test("check element attribute with one item data rules test", async (t) => {

	await t.test("type range", ()=>{
		const data = {
			groupName: "first groupfirst groupfirst groupfirst",
			unit: "KW",
			zhName: "Element One",
			enName: "SS_ONE",
			type: ATTRIBUTE_TYPE.RANGE,
			defaultValue: [ 90, 200 ],
		} as ELEMENT_ATTRIBUTE;
	
		const result = checkElementAttributeByOne(data);
		if(!result){
			throw new Error("Not pass");
		}
	});

	await t.test("type select", ()=>{
		const data = {
			groupName: "first groupfirst groupfirst groupfirst",
			unit: "KW",
			zhName: "Element One",
			enName: "SS_TWO",
			type: ATTRIBUTE_TYPE.SELECT,
			defaultValue: 200,
			options: [ {
				label: "one",
				value: "100"
			},{
				label: "two",
				value: 200
			} ]
		} as ELEMENT_ATTRIBUTE;

		const result = checkElementAttributeByOne(data);
		if(!result){
			throw new Error("Not pass");
		}
	});

});
