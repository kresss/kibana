/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React from 'react';

import {
  EuiColorPicker,
  EuiFlexGroup,
  EuiFlexItem,
  EuiKeyboardAccessible,
} from '@elastic/eui';

import * as ol from 'openlayers';

const DEFAULT_COLOR = '#e6194b';
const TEMP_FILL_OPACITY = '05';
const FILL_OPACITY = '15';
const TEMP_STROKE_OPACITY = '77';
const STROKE_OPACITY = 'FF';

export class FillAndOutlineStyle {

  static type = 'FILL_AND_OUTLINE';
  static DEFAULT_COLOR_HEX = '#ffffff';

  constructor(descriptor) {
    this._descriptor = descriptor;
  }

  static canEdit(styleInstance) {
    return styleInstance.constructor === FillAndOutlineStyle;
  }

  static createDescriptor(color) {
    return {
      type: FillAndOutlineStyle.type,
      color: color
    };
  }

  static getDisplayName() {
    return 'Vector Adjustment';
  }

  static renderEditor({ handleStyleChange, style, reset }) {

    if (style === null) {
      const fallbackDescriptor = FillAndOutlineStyle.createDescriptor(FillAndOutlineStyle.DEFAULT_COLOR_HEX);
      style = new FillAndOutlineStyle(fallbackDescriptor);
    }

    const changeColor = (color) => {
      const fillAndOutlineDescriptor = FillAndOutlineStyle.createDescriptor(color);
      handleStyleChange(fillAndOutlineDescriptor);
    };
    const selectedColor = style ? style.getHexColor() : FillAndOutlineStyle.DEFAULT_COLOR_HEX;
    return (
      <EuiFlexGroup alignItems="center">
        <EuiFlexItem grow={false}>
          <EuiColorPicker
            onChange={changeColor}
            color={selectedColor}
          />
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <p className="kuiText">
            <EuiKeyboardAccessible>
              <a className="kuiLink" onClick={reset}>
                Reset
              </a>
            </EuiKeyboardAccessible>
          </p>
        </EuiFlexItem>
      </EuiFlexGroup>
    );
  }

  getHexColor() {
    return this._descriptor.color;
  }


  getOLLayerStyle(temp = false) {
    const color = this.getHexColor() || DEFAULT_COLOR;
    return new ol.style.Style({
      fill: new ol.style.Fill({
        // TODO: Make alpha channel adjustable
        color: `${color}${temp ? TEMP_FILL_OPACITY : FILL_OPACITY}`,
      }),
      stroke: new ol.style.Stroke({
        color: `${color}${temp ? TEMP_STROKE_OPACITY : STROKE_OPACITY}`,
        width: temp ? 1 : 2
      })
    });
  }


}
