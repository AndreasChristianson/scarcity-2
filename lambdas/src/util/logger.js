import Logger from 'lamlog';

const defaultLogger = new Logger({ name: process.env.AWS_LAMBDA_FUNCTION_NAME, level: 'trace' });

const getDefaultLogger = () => defaultLogger;

const getSubprocessLogger = (name) => defaultLogger.child({ name });

export const getLogger = name => name ? getSubprocessLogger(name) : getDefaultLogger;