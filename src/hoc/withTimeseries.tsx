import { Timeseries } from '@cognite/sdk';
import * as sdk from '@cognite/sdk';
import React from 'react';
import { Subtract } from 'utility-types';
import { LoadingBlock } from '../components/common/LoadingBlock/LoadingBlock';
import {
  CanceledPromiseException,
  ComponentWithUnmountState,
  connectPromiseToUnmountState,
} from '../utils/promise';

export interface WithTimeseriesDataProps {
  timeseries: Timeseries;
}

export interface WithTimeseriesProps {
  timeseriesId: number;
  customSpinner?: React.ReactNode;
}

export interface WithTimeseriesState {
  isLoading: boolean;
  timeseries: Timeseries | null;
  timeseriesId: number;
}

export const withTimeseries = <P extends WithTimeseriesDataProps>(
  WrapperComponent: React.ComponentType<P>
) =>
  class
    extends React.Component<
      Subtract<P, WithTimeseriesDataProps> & WithTimeseriesProps,
      WithTimeseriesState
    >
    implements ComponentWithUnmountState {
    static getDerivedStateFromProps(
      props: P & WithTimeseriesProps,
      state: WithTimeseriesState
    ) {
      if (props.timeseriesId !== state.timeseriesId) {
        return {
          isLoading: true,
          timeseries: null,
          timeseriesId: props.timeseriesId,
        };
      }

      return null;
    }

    isComponentUnmounted = false;

    constructor(props: P & WithTimeseriesProps) {
      super(props);

      this.state = {
        isLoading: true,
        timeseries: null,
        timeseriesId: props.timeseriesId,
      };
    }

    componentDidMount() {
      this.loadTimeseries();
    }

    componentWillUnmount() {
      this.isComponentUnmounted = true;
    }

    componentDidUpdate(prevProps: P & WithTimeseriesProps) {
      if (prevProps.timeseriesId !== this.props.timeseriesId) {
        this.loadTimeseries();
      }
    }

    async loadTimeseries() {
      try {
        const timeseries = await connectPromiseToUnmountState(
          this,
          sdk.TimeSeries.retrieve(this.props.timeseriesId, true)
        );

        this.setState({
          isLoading: false,
          timeseries,
        });
      } catch (error) {
        if (error instanceof CanceledPromiseException !== true) {
          throw error;
        }
      }
    }

    render() {
      const { timeseriesId, customSpinner, ...restProps } = this.props;
      const { isLoading, timeseries } = this.state;

      if (isLoading) {
        return customSpinner || <LoadingBlock />;
      }

      if (timeseries) {
        return (
          <WrapperComponent
            {...((restProps as any) as P)}
            timeseries={timeseries}
          />
        );
      }

      return null;
    }
  };