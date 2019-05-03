import { Event as ApiEvent } from '@cognite/sdk';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React, { SyntheticEvent } from 'react';
import { eventPreviewStrings, EVENTS, eventWithout } from '../../../mocks';
import { defaultStrings, EventPreviewView } from './EventPreviewView';

configure({ adapter: new Adapter() });

// @ts-ignore - ignore mock type casting
const event = EVENTS[0] as ApiEvent;
const onShowDetails = (e: SyntheticEvent) => e;

describe('EventPreview', () => {
  it('Renders without exploding', () => {
    const wrapper = mount(
      <EventPreviewView
        event={event}
        onShowDetails={onShowDetails}
        strings={{}}
      />
    );
    expect(wrapper).toHaveLength(1);
  });

  it('Render "0" value in case of missing "metadata" property in event', () => {
    const missingMetadataEvent = eventWithout('metadata');
    const wrapper = mount(
      <EventPreviewView
        event={(missingMetadataEvent as any) as ApiEvent}
        onShowDetails={onShowDetails}
        strings={eventPreviewStrings}
      />
    );

    let { metadataSummary } = eventPreviewStrings;
    metadataSummary = metadataSummary.replace('{{count}}', '0');

    expect(wrapper.contains(metadataSummary)).toBeTruthy();
  });

  it('Renders right without "description" field in "event" property', () => {
    const missingDescriptionEvent = eventWithout('description');
    const wrapper = mount(
      <EventPreviewView
        event={(missingDescriptionEvent as any) as ApiEvent}
        onShowDetails={onShowDetails}
        strings={eventPreviewStrings}
      />
    );

    const { noDescription } = eventPreviewStrings;
    expect(wrapper.contains(noDescription)).toBeTruthy();
  });

  it('Applies default strings in case of undefined "strings" property', () => {
    const missingMetadataEvent = eventWithout('description');
    const wrapper = mount(
      <EventPreviewView
        event={(missingMetadataEvent as any) as ApiEvent}
        onShowDetails={onShowDetails}
      />
    );

    const { noDescription } = defaultStrings;
    expect(wrapper.contains(noDescription as string)).toBeTruthy();
  });
});