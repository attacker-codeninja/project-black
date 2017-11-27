import Notifications from 'react-notification-system-redux'

import { 
	createScope, 
	deleteScope,
	renewScopes,
	updateScope,
	resolveScopes
} from './actions';

import Connector from '../SocketConnector.jsx';
import ScopesSocketioEventsEmitter from './ScopesSocketioEventsEmitter.js';


class ScopesSocketioEventsSubscriber {
	/* Singleton class for managing events subscription for the scopes */
	constructor(store, project_uuid) {
        this.store = store;
        this.project_uuid = project_uuid;
        this.connector = new Connector('scopes');

        this.connector.after_connected((x) => {
        	this.emitter = new ScopesSocketioEventsEmitter();
        	this.emitter.requestRenewScopes(this.project_uuid);
        });

        this.basic_events_registration();
	}

	basic_events_registration() {
		/* Register handlers on basic events */
		// Received all scopes in one message
		this.register_socketio_handler('scopes:part:set', renewScopes);

		this.register_socketio_handler('scopes:update:back', updateScope);
		this.register_socketio_handler('scopes:create', createScope);
		this.register_socketio_handler('scopes:delete', deleteScope);
		this.register_socketio_handler('scopes:resolve:done', resolveScopes);
	}

	register_socketio_handler(eventName, dispatchCallback, callback) {
		/* Just a wrapper for connector.listen */
		this.connector.listen(eventName, (data) => {
			if (data.status == 'success') {
				this.store.dispatch(dispatchCallback(data, this.project_uuid));
			}
			else {
				this.store.dispatch(Notifications.error({
					title: 'Error with scopes',
					message: data.text
				}));
			}				
		});
	}

    close() {
        this.connector.close();
    }	
}

export default ScopesSocketioEventsSubscriber;
