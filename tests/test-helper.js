import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-qunit';
import setupSinon from 'ember-sinon-qunit';
import * as QUnit from 'qunit';
import { setup } from 'qunit-dom';
import Application from 'surely/app';
import config from 'surely/config/environment';

setApplication(Application.create(config.APP));

setup(QUnit.assert);
setupSinon();

start();
