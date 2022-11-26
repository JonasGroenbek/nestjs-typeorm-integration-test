import { DataSource, DataSourceOptions } from 'typeorm';
import { postgresConfig } from './postgres.config';

const datasource = new DataSource(postgresConfig as DataSourceOptions);
datasource.initialize();

export default datasource;
