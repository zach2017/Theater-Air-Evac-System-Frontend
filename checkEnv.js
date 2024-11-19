const requiredEnvVars = ['TAES_KEY'];

const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);

/*  TODO: 

 if (missingEnvVars.length > 0) {
  console.error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  process.exit(1); // Exit with an error code to stop the app
}
  
*/
