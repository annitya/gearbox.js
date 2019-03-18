import Metrics from '@cognite/metrics';
import { Button, Modal } from 'antd';
import ViewEventSidebar from 'components/ViewEventSidebar';
import React from 'react';
import { Trans, translate } from 'react-i18next';
import styled from 'styled-components';
import { formatDatetime } from 'utils/formatters';
// import { VApiEvent } from './../../utils/validators';
import { VApiEvent } from 'utils/validators';

const EventTitle = styled.div`
  font-size: 1.4rem;
  padding-bottom: 16px;
`;
const EventType = styled.div`
  font-size: 1.2rem;
  color: #40a9ff;
  padding-bottom: 8px;
`;
const EventDescription = styled.div`
  font-size: 1.1rem;
  padding-bottom: 16px;
`;

const Container = styled.div`
  color: rgba(0, 0, 0, 0.45);
  padding: 16px;
  width: 300px;
  background: white;
  border-radius: 4px;
  border: 1px solid #eee;
  margin-top: 32px;
`;

const defaultProps = {};

export interface EventViewProps {
  event: VApiEvent;
  // Populated by react-i18next.
  t: any;
}

export interface EventViewState {
  showDetails: boolean;
}

class EventPreview extends React.Component<EventViewProps, EventViewState> {
  public state: EventViewState = { showDetails: false };
  public metrics = Metrics.create('EventPreview');

  public onShowDetails = () => {
    this.metrics.track('onShowDetails', {
      eventId: this.props.event.id,
    });
    this.setState({ showDetails: true });
  };

  public onCloseDetails = () => {
    this.metrics.track('onCloseDetails');
    this.setState({ showDetails: false });
  };

  public render() {
    const {
      t,
      event: { startTime, endTime, type, subtype, description, metadata = {} },
    } = this.props;
    const { showDetails } = this.state;
    const startDate = formatDatetime(startTime, 'Unknown');
    const endDate = formatDatetime(endTime, 'Ongoing');
    const metadataCount = Object.keys(metadata).length;

    return [
      <Container key="container">
        <EventType>{[type, subtype].filter(Boolean).join(' / ')}</EventType>
        <EventTitle>
          {description ||
            t('noDescription', { defaultValue: 'No description' })}
        </EventTitle>
        <EventDescription>
          <Trans i18nKey="start">Start: {{ startDate }}</Trans>
          <br />
          <Trans i18nKey="end">End: {{ endDate }}</Trans>
        </EventDescription>
        <EventDescription>
          <Trans i18nKey="metadataSummary" count={metadataCount}>
            Contains {{ metadataCount }} additional pieces of data
          </Trans>
        </EventDescription>
        <Button type="primary" onClick={this.onShowDetails}>
          <Trans i18nKey="details">Explore event details</Trans>
        </Button>
      </Container>,
      <Modal
        key="details-modal"
        title={description}
        visible={showDetails}
        bodyStyle={{ maxHeight: '75vh', overflow: 'auto' }}
        onOk={this.onCloseDetails}
        onCancel={this.onCloseDetails}
        footer={[
          <Button key="back" onClick={this.onCloseDetails}>
            <Trans i18nKey="global:close">Close</Trans>
          </Button>,
        ]}
      >
        <ViewEventSidebar
          annotation={{
            ...this.props.event,
            additionalData: metadata,
          }}
        />
      </Modal>,
    ];
  }
}

EventPreview.propTypes = propTypes;
EventPreview.defaultProps = defaultProps;

export default translate('EventPreview')(EventPreview);
