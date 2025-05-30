import type { ReactNode } from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  emoji: string;
  description: ReactNode;
};

const FeatureList = [
  {
    title: 'Rate Limit Protection',
    emoji: '🚦',
    description: (
      <>
        Behaves as a respectful client with automatic rate limit handling and retry strategies.
      </>
    ),
  },
  {
    title: 'HCP Terraform + TFE Support',
    emoji: '🧩',
    description: (
      <>
        Fully compatible with both HCP Terraform and self-hosted Terraform Enterprise.
      </>
    ),
  },
  {
    title: 'Hasura style filtering',
    emoji: '🔍',
    description: (
      <>
        Implements Hasura-style filtering for complex queries, enabling powerful data retrieval.
      </>
    ),
  },
  {
    title: 'Entity Graph Architecture',
    emoji: '🕸️',
    description: (
      <>
        Rich GraphQL schema with nested resolvers representing Terraform's real-world relationships.
      </>
    ),
  },
  {
    title: 'Pagination Support',
    emoji: '📄',
    description: (
      <>
        Transparent support for paginated resources across all APIs — just query and go.
      </>
    ),
  },
  {
    title: 'Lightweight & Containerized',
    emoji: '🐳',
    description: (
      <>
        Ships as a minimal Docker image with cross-architecture support — deployable anywhere in seconds.
      </>
    ),
  },
  {
    title: 'Built on Apollo Server',
    emoji: '🚀',
    description: (
      <>
        Leverages the power of Apollo Server for robust GraphQL delivery
      </>
    ),
  },
  {
    title: 'Parallel Fetching',
    emoji: '⚡️',
    description: (
      <>
        Built-in parallel processing for fast, efficient data fetching — safely bounded by configuration.
      </>
    ),
  },
  {
    title: 'Schema Introspection & Autocompletion',
    emoji: '🧠',
    description: (
      <>
        Provides a fully introspectable GraphQL schema, enabling rich IDE support with autocompletion, inline docs, and type safety during query composition.
      </>
    ),
  }
];

function Feature({ title, emoji, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <div style={{ fontSize: '3rem' }}>{emoji}</div>
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
