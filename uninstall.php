<?php
// die when the file is called directly
if (!defined('WP_UNINSTALL_PLUGIN')) {
    die;
}

//cleanup options table and remove bittips related entries
delete_option('bittips_tipjar_paytag');