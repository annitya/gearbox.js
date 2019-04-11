import { SyntheticEvent } from 'react';
import { VApiQuery, VAdvancedSearch, VAsset } from './';

type VId = number | string;
type VOnClick = (event: SyntheticEvent) => void;
type VOnAssetSearchResult = (result: any, apiQuery?: VApiQuery) => void;
type VOnAssetSearch = (apiQuery: VApiQuery) => void;
type VOnAssetListCallback = (assets: VAsset[]) => void;
type VOnAdvancedSearchChange = (searchFields: VAdvancedSearch) => void;

type VEmptyCallback = () => void;
type VCallbackStrings = (strings: string[]) => void;
type VIdCallback = (id: VId) => void;
type VSetVideoRefCallback = (element: HTMLVideoElement | null) => void;

interface VOcrRequest {
  image: string;
  url?: string;
  key?: string;
}

interface VErrorResponse {
  status: number;
  message: string;
  error?: Error;
}

interface VPureObject {
  [name: string]: VId;
}

export {
  VId,
  VOnClick,
  VOnAssetSearchResult,
  VOnAssetSearch,
  VIdCallback,
  VOnAdvancedSearchChange,
  VEmptyCallback,
  VCallbackStrings,
  VOnAssetListCallback,
  VSetVideoRefCallback,
  VErrorResponse,
  VOcrRequest,
  VPureObject,
};