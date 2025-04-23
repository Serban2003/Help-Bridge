import sql from "mssql/msnodesqlv8.js";

// SQL Server config
export const dbConfig = {
    connectionString:
    "Driver={ODBC Driver 18 for SQL Server};Server=localhost;Database=HelpBridge;Trusted_Connection=Yes;TrustServerCertificate=Yes;",
    driver: "msnodesqlv8",
};
  
export { sql };