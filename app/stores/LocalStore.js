import ApplicationStore from './ApplicationStore';
import ActionTypes from '../constants/ActionTypes';

class LocalStore extends ApplicationStore {
  constructor() {
    super();
    if(localStorage.state)
        try { this.data = JSON.parse(localStorage.state)
        } catch (e) { /* do nothing */ }
    this.data =  this.data || {}
    this.subscribe(() => this._registerToActions.bind(this));
  }

  _registerToActions(action) {
    switch(action.type) {
      case ActionTypes.CONFIG_CHANGE:
        this.setAll(action.body.config);
        break;
      default:
        break;
    }
    this.emitChange();
  };
}

export default new LocalStore();
