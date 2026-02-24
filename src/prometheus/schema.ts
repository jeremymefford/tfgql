import { gql } from "graphql-tag";

const prometheusSchema = gql`
  """
  The output format for rendered metrics.
  """
  enum MetricFormat {
    PROMETHEUS
    OPENMETRICS
  }

  """
  A single metric data point with its name, label set, and numeric value.
  """
  type PrometheusMetricSample {
    name: String!
    labels: JSON!
    value: Float
  }

  """
  The result of a Prometheus metrics query, containing both raw exposition text and structured samples.
  """
  type PrometheusResult {
    """
    Raw Prometheus exposition text, ready for ingestion
    """
    text: String!
    """
    Structured metric samples for programmatic access
    """
    samples: [PrometheusMetricSample!]!
    """
    Number of metric families rendered
    """
    familyCount: Int!
    """
    Number of individual samples rendered
    """
    sampleCount: Int!
  }

  extend type Query {
    """
    Execute all configured metric definitions and return results
    in Prometheus exposition format.
    """
    metrics(
      format: MetricFormat = PROMETHEUS
      """
      Optional: only render metrics matching these names
      """
      names: [String!]
      """
      Override default org scope
      """
      includeOrgs: [String!]
      excludeOrgs: [String!]
    ): PrometheusResult!

    """
    Execute a single ad-hoc metric query. The caller supplies the
    GraphQL query, result path, value field, and label mappings.
    """
    metricFromQuery(
      name: String!
      help: String
      type: String = "gauge"
      query: String!
      variables: JSON
      resultPath: String!
      valueField: String!
      labels: JSON!
      format: MetricFormat = PROMETHEUS
    ): PrometheusResult!
  }
`;

export default prometheusSchema;
