
export function catchAsync(){
    return (target, key, descriptor:PropertyDescriptor)=>{
        const originalMethod = descriptor.value;
        
        descriptor.value = async function (...args:any[]) {
            try {
                console.log("in catch async");
                return await originalMethod.apply(this, args);
            } catch (error) {
                console.log("this is error ", error);
                return error;
            }
        };   
        return descriptor;
    }

}