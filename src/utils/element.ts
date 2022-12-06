/*
 * @Author: Hearth 
 * @Date: 2022-12-06 15:58:09 
 * @Last Modified by: Hearth
 * @Last Modified time: 2022-12-06 17:13:37
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

export function checkAttribute(data: ELEMENT_ATTRIBUTE): null | ELEMENT_ATTRIBUTE{
	const { groupName, name, unit, type } = data;
	let { defaultValue, options } = data;

	if(!checkStrAndMaxLength(groupName, 50) || !checkStrAndMaxLength(name, 50) || !checkStrAndMaxLength(unit, 10)){
		return null;
	}

	let isOkDefaultValue = false;
	let checkOptions: Array<SELECT_OPTION | null>;

	switch (type) {
	case ATTRIBUTE_TYPE.INPUT:
		if(defaultValue && !checkStrAndMaxLength(defaultValue.toString(), 50)){
			return null;
		}
		break;
	case ATTRIBUTE_TYPE.RANGE:
		if(defaultValue && !Array.isArray(defaultValue)){
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
			if(!checkStrAndMaxLength(label, 50) || !checkStrAndMaxLength(value.toString(), 50)){
				return null;
			}

			if(defaultValue === value){
				isOkDefaultValue = true;
			}

			return { label, value };
		});

		if(!isOkDefaultValue){
			return null;
		}

		if(checkOptions.filter(item=>!!item).length !== checkOptions.length){
			return null;
		}

		options = checkOptions.filter(item=>!!item) as SELECT_OPTION[];

		break;
	default:
		return null;
	}

	return {
		groupName, name, unit, type, defaultValue, options
	} as ELEMENT_ATTRIBUTE;
}

export function checkElementAttributes(data: ELEMENT_ATTRIBUTE[]): boolean{
	
	return true;
}
