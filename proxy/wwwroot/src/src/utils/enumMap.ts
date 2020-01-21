type EnumType = { [s: string]: string };

function mapEnum (enumerable: EnumType, fn: Function): any[] {
    // get all the members of the enum
    let enumMembers: any[] = Object.keys(enumerable).map(key => enumerable[key]);

    // Get the numeric or string value
    let enumValues: number | string[] = enumMembers.filter(v => typeof v === "number" || typeof v === "string");

    // now map through the enum values
    return enumValues.map(m => fn(m));
}

export default mapEnum;