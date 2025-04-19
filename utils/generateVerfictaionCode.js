export const generateVerficationCode=()=>{
    const verficationCode = Math.floor(100000 + Math.random() * 900000).toString();
    return verficationCode;
}