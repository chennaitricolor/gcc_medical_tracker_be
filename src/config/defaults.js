module.exports = {
  port: "4004",
  db: {
    username: "riyaz",
    password: "",
    database: "gcc_medical_tracker",
    host: "localhost",
    dialect: "postgres",
  },
  aws: {
    config: {
      region: process.env.AWS_IAM_REGION,
      credentials: {
        AccountId: process.env.AWS_IAM_ACCOUNT_ID,
        RoleSessionName: process.env.AWS_IAM_ROLE_SESSION_NAME,
        RoleArn: process.env.AWS_IAM_ROLE_ARN,
        IdentityPoolId: process.env.AWS_IAM_POOL_ID,
      },
    },
    quicksight: {
      region: process.env.AWS_QS_REGION,
      dashboard: {
        AwsAccountId: process.env.AWS_IAM_ACCOUNT_ID, 
        DashboardId: process.env.AWS_QS_DASHBOARD_ID,
        IdentityType: 'IAM',
        ResetDisabled: true,
        SessionLifetimeInMinutes: 100,
        UndoRedoDisabled: false,
      },
    },
  },
};
