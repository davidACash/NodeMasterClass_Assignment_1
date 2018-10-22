// Container for all environments
var environments = {};

// Development
environments.development = {
    'port': 3000,
    'envName' : 'development'
};

// Production
environments.production = {
    'port' : 3000,
    'envName' : 'production'
};

// Determine the environment passed as a command-line argument
var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment is one of the environments above
// If not, default to development
var environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.development;

// Export the module
module.exports = environmentToExport;