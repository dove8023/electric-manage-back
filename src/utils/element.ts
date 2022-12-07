/*
 * @Author: Hearth 
 * @Date: 2022-12-06 15:58:09 
 * @Last Modified by: Hearth
 * @Last Modified time: 2022-12-07 10:13:18
 * @content what is the content of this file. */

import { isString } from "class-validator";
import { ELEMENT_ATTRIBUTE, ATTRIBUTE_TYPE, SELECT_OPTION } from "../interface";

export function checkSerialNumber(num: string){
	const reg = /[A-Z0-9]{5}/;
	return reg.test(num);
}

export function checkStrAndMaxLength(str: string | undefined, len: number): boolean{
	if(!isString(str)){
		return false;
	}

	return !!str.length && str.length <= len;
}

export function checkElementAttributeByOne(data: ELEMENT_ATTRIBUTE): null | ELEMENT_ATTRIBUTE{
	const { groupName, name, unit, type } = data;
	let { defaultValue, options } = data;

	if(!checkStrAndMaxLength(groupName, 50) || !checkStrAndMaxLength(name, 50) || !checkStrAndMaxLength(unit, 10)){
		return null;
	}

	let checkOptions: Array<SELECT_OPTION | null>;
	let checkOptionsDefaultValue = false;

	switch (type) {
	case ATTRIBUTE_TYPE.INPUT:
		if(defaultValue && !Number(defaultValue)){
			return null;
		}
		break;
	case ATTRIBUTE_TYPE.RANGE:
		if(!Array.isArray(defaultValue)){
			return null;
		}

		if(defaultValue[ 0 ] && !Number(defaultValue[ 0 ])){
			return null;
		}

		if(defaultValue[ 1 ] && !Number(defaultValue[ 1 ])){
			return null;
		}

		defaultValue = defaultValue.slice(0, 2);
		break;
	case ATTRIBUTE_TYPE.SELECT:
		if(!options || !Array.isArray(options)){
			return null;
		}

		checkOptions = options.map((item)=>{
			const { label, value } = item;
			if(!checkStrAndMaxLength(label, 50) || !Number(value)){
				return null;
			}

			if(defaultValue === value){
				checkOptionsDefaultValue = true;
			}

			return { label, value };
		});

		if(!checkOptionsDefaultValue){
			return null;
		}

		if(checkOptions.indexOf(null) > -1){
			return null;
		}

		options = checkOptions as SELECT_OPTION[];

		break;
	default:
		return null;
	}

	return {
		groupName, name, unit, type, defaultValue, options
	} as ELEMENT_ATTRIBUTE;
}

export function checkElementAttributes(data: ELEMENT_ATTRIBUTE[]): null | ELEMENT_ATTRIBUTE[]{
	// check name, name must unique and not undefined
	let names = data.map(item=>item.name).filter(item=>!!item);
	names = [ ...new Set(names) ];

	if(names.length !== data.length){
		return null;
	}

	const result = data.map(item => checkElementAttributeByOne(item));
	if(result.indexOf(null) > -1){
		return null;
	}

	return result as ELEMENT_ATTRIBUTE[];
}
