import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as aws_cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as  origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3Deployment from 'aws-cdk-lib/aws-s3-deployment';
import * as path from 'path';


export class AwsCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, `RsProject`, {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const distribution = new aws_cloudfront.Distribution(this, 'RsSchoolProjectDistribution', {
      comment: 'CloudFront CDK distribution for RS School project',
      defaultRootObject: 'index.html',
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(bucket),
        viewerProtocolPolicy: aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
        },
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
        }
      ],
    });

    cdk.Tags.of(bucket).add('deployed-via', 'cdk');
    cdk.Tags.of(bucket).add('project', 'rs-school');

    cdk.Tags.of(distribution).add('deployed-via', 'cdk');
    cdk.Tags.of(distribution).add('project', 'rs-school');

    new s3Deployment.BucketDeployment(this, 'DepRsProject', {
      sources: [s3Deployment.Source.asset(path.join(__dirname, '../../../dist'))],
      destinationBucket: bucket,
      distribution,
      distributionPaths: ['/*'],
      prune: true,
    });

    new cdk.CfnOutput(this, 'FrontendURL', {
      value: `https://${distribution.distributionDomainName}`,
      description: 'The URL of the CloudFront distribution serving the frontend application',
    });
  }
}
