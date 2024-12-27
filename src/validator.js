export const validator = (schema, data) => {
    const { error, value } = schema.validate(data, { abortEarly: true });
    if (error) {
        //this is intentional, as abortEarly returns only first error
        const detail = error.details[0];
        return { error: true, message: detail.message };
    }
    return { error: false, value };
}