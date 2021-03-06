'use strict';

openerp.recurring_consignment = function (instance) {
    var module = instance.point_of_sale;

    // we can't extend it because self.pos not ready yet
    var _initializePosModel_ = module.PosModel.prototype.initialize;
    module.PosModel.prototype.initialize = function(session, attributes){
        // override domain for res.partner to limit customers loaded
        this.models.some(function (m, idx) {
            if (m.model !== 'res.partner')
                return false;
            // check if not already done by someone else
            for(var i = 0; i < m.domain.length; i++) {
                var domain_tuple = m.domain[i];
                if (domain_tuple[0] === 'is_consignor') {
                    return true; // domain already added
                }
            }
            m.domain.push(['is_consignor', '=', false]);
            return true; // no need to continue
        });
        return _initializePosModel_.call(this, session, attributes);
    };
};
