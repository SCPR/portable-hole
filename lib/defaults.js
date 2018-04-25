'use strict';

module.exports = {

    DefaultAdapters : { // when we get a placeholder, this tells us what adapter class to instantiate
        'youtube'       : 'youtube',
        'vimeo'         : 'embedly',
        'brightcove'    : 'brightcove',
        'ustream'       : 'embedly',
        'livestream'    : 'embedly',
        'vine'          : 'embedly',
        'googlemaps'    : 'embedly',
        'googlefusion'  : 'googlefusion',
        'scribd'        : 'embedly',
        'documentcloud' : 'documentcloud',
        'polldaddy'     : 'polldaddy',
        'facebook'      : 'facebook',
        'storify'       : 'storify',
        'coveritlive'   : 'coveritlive',
        'rebelmouse'    : 'rebelmouse',
        'firetracker'   : 'firetracker',
        'twitter'       : 'twitter',
        'instagram'     : 'instagram',
        'soundcloud'    : 'embedly',
        'spotify'       : 'embedly',
        'ranker'        : 'ranker',
        'other'         : 'embedly'
    },

    DefaultOptions : {
         // Adapter that gets used when the service isn't recognized
        defaultAdapter   : 'Embedly',
        // Service that gets used when the `data-service` attribute is missing
        defaultService   : 'other',
        // The class that the embed placeholders have
        placeholderClass : 'embed-placeholder',
        // The class the embed's wrapper should be given
        wrapperClass     : 'embed-wrapper',
        // The element name which should be wrapped around all embed.
        // TODO: Allow setting this to 'false' for no wrapper.
        wrapperElement   : 'div',
        // Default embed placement, if a placement is somehow missing or
        // it doesn't exist in the PlacementFunctions object.
        defaultPlacement : 'after'
    },

    // jQuery function mapping for embed placement,
    // relative to the placeholder link.
    //
    // Keys are the `data-placement` attribute, and values are the
    // jQuery functions.
    PlacementFunctions : {
        before  : 'before',
        after   : 'after',
        replace : 'replaceWith'
    }

};