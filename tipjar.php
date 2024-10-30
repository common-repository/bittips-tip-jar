<?php
/*
   Plugin Name: Bittips Tip Jar
   Description:  Tip Jar Donate Payment button for Wordpress. Use your wallets like Venmo, CashApp, Paypal to accept Cash / Dollar Tips, Gratuity, Donations and Payment. Also accept Tips in Bitcoin, Ethereum and other crypto. Better than social share button icons as it helps monetize site. Let community pay you money rewards. Use it to raise funds / fundraising.
   Version: 1.1.0
   Author: Bittips
   Author URI: https://bit.tips
   License: GPLv3
   */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

add_action('wp_enqueue_scripts', 'bittips_script_enqueue');
add_shortcode('bittips-tipjar', 'bittips_tipjar_shortcode');

function bittips_tipjar_shortcode($atts) {
    $output = '<bittips-widget pay-tag="'.esc_html(get_option( 'bittips_tipjar_paytag')).'"></bittips-widget>';
    return $output;
}

function bittips_script_enqueue() {
        wp_enqueue_script(
            'bittips_tipjar',
            plugin_dir_url(__FILE__).'tipjar.js'
        );
}

if (!defined('BITTIPS_VERSION_KEY'))
    define('BITTIPS_VERSION_KEY', 'myplugin_version');

if (!defined('BITTIPS_VERSION_NUM'))
    define('BITTIPS_VERSION_NUM', '1.0.0');

add_option(BITTIPS_VERSION_KEY, BITTIPS_VERSION_NUM);

add_filter('plugin_action_links', 'bittips_plugin_action_links', 10, 2);

/**
 * Add settings link
 */
function bittips_plugin_action_links($links, $file) {
    static $this_plugin;

    if (!$this_plugin) {
        $this_plugin = plugin_basename(__FILE__);
    }

    if ($file == $this_plugin) {
        // The "page" query string value must be equal to the slug
        // of the Settings admin page we defined earlier, which in
        // this case equals "myplugin-settings".
        $settings_link = '<a href="' . get_bloginfo('wpurl') . '/wp-admin/admin.php?page=bittips_tipjar">Settings</a>';
        array_unshift($links, $settings_link);
    }

    return $links;
}

/**
 * @internal never define functions inside callbacks.
 * these functions could be run multiple times; this would result in a fatal error.
 */
 
/**
 * custom option and settings
 */
function bittips_tipjar_settings_init() { 
    // Register a new setting for "bittips_tipjar" page.
    register_setting( 'bittips_tipjar', 'bittips_tipjar_paytag', 'bittips_tipjar_paytag_validation' );
    
    
    // Register a new section in the "bittips_tipjar" page.
    add_settings_section(
        'bittips_tipjar_section_basic',
        __( 'Settings', 'bittips_tipjar' ), 'bittips_tipjar_section_basic_callback',
        'bittips_tipjar'
    );
 
    // Register a new field in the "bittips_tipjar_section_basic" section, inside the "bittips_tipjar" page.
    add_settings_field(
        'bittips_tipjar_field_paytag', 
        __( 'Bittips Tip Jar Username', 'bittips_tipjar' ),
        'bittips_tipjar_field_paytag_text',
        'bittips_tipjar',
        'bittips_tipjar_section_basic',
        array(
            'label_for'         => 'bittips_tipjar_field_paytag',
            'class'             => 'bittips_tipjar_row',
            'bittips_tipjar_custom_data' => 'custom',
        )
    );

}

/**
 * Register our bittips_tipjar_settings_init to the admin_init action hook.
 */
add_action( 'admin_init', 'bittips_tipjar_settings_init' );
 
 
/**
 * Custom option and settings:
 *  - callback functions
 */
 
 
/**
 *  Admin Section callback function.
 *
 * @param array $args  The settings array, defining title, id, callback.
 */
function bittips_tipjar_section_basic_callback( $args ) {
    ?>
    <p id="<?php echo esc_attr( $args['id'] ); ?>">
        <strong>Step 1: </strong>Create your free Tip Jar at <a href=https://bit.tips style="font-weight:bold;" aria-label="visit bit.tips" target="_blank" rel="noopener noreferrer">bit.tips</a> . It takes just a minute!<br/>
        <strong>Step 2: </strong>Enter your bittips username below and save to activate your Tip Jar buttons.<br/>
        <strong>Step 3: </strong>Go to Dashboard -> Appearance -> Customize -> Widgets and add Bittips Donate Tip Jar widget anywhere on your website.You can also add it anywhere in your post with [bittips-tipjar] shortcode.<br/>
    </p>
    <?php
}
 
/**
 * Admin Setting Paytag callback function.
 * @param array $args
 */
function bittips_tipjar_field_paytag_text( $args ) {
    // Get the value of the setting we've registered with register_setting()
    ?>
    ~<input type="text" name="bittips_tipjar_paytag" value="<?php echo esc_html( get_option( 'bittips_tipjar_paytag' )); ?>" />
    <p class="description">
    <strong>Note: </strong>First create your free Tip Jar at <a href=https://bit.tips aria-label="visit bit.tips" target="_blank" rel="noopener noreferrer">
              bit.tips</a>. Then enter your bit.tips username above. 
    </p>
  
    <?php
}
 
/**
 * Add the top level Admin menu page.
 */
function bittips_tipjar_options_page() {
    add_menu_page(
        'Bittips Tip Jar ',
        'Bittips Tip Jar',
        'manage_options',
        'bittips_tipjar',
        'bittips_tipjar_options_page_html'
    );
}
 
 
/**
 * Register our bittips_tipjar_options_page to the admin_menu action hook.
 */
add_action( 'admin_menu', 'bittips_tipjar_options_page' );
 
 
/**
 * Top level Admin menu callback function
 */
function bittips_tipjar_options_page_html() {
    // check user capabilities
    if ( ! current_user_can( 'manage_options' ) ) {
        return;
    }
 
    // add error/update messages
 
    // check if the user have submitted the settings
    if ( isset( $_GET['settings-updated'] ) ) {
        // add settings saved message with the class of "updated"
        add_settings_error( 'bittips_tipjar_messages', 'bittips_tipjar_message', __( 'Settings Saved', 'bittips_tipjar' ), 'updated' );
    }
 
    // show error/update messages
    settings_errors( 'bittips_tipjar_messages' );
    ?>
    <div class="wrap">
        <h1><?php echo esc_html( get_admin_page_title() ); ?></h1>
        <form action="options.php" method="post">
            <?php
            // output security fields for the registered setting "bittips_tipjar"
            settings_fields( 'bittips_tipjar' );
            // output setting sections and their fields
            // (sections are registered for "bittips_tipjar", each field is registered to a specific section)
            do_settings_sections( 'bittips_tipjar' );
            // output save settings button
            submit_button( 'Save Settings' );
            ?>
        </form>
    </div>
    <?php
}

/**
 * Sanitize paytag to prevent xss
 */
function bittips_tipjar_paytag_validation( $str ) {
    
    $output =  esc_html( $str );
    return $output;
}
 
class Bittips_TipJar_Widget extends WP_Widget {
 
    function __construct() {
 
        parent::__construct(
            'bittips_tipjar_widget',  // Base ID
            'Bittips Donate Tip Jar'   // Name
        );
 
        add_action( 'widgets_init', function() {
            register_widget( 'Bittips_TipJar_Widget' );
        });
 
    }
 
    public $args = array(
        'before_title'  => '<h4 class="widgettitle">',
        'after_title'   => '</h4>',
        'before_widget' => '<div class="widget-wrap">',
        'after_widget'  => '</div></div>'
    );
 
    public function widget( $args, $instance ) {
 
        echo $args['before_widget'];
 
        if ( ! empty( $instance['title'] ) ) {
            echo $args['before_title'] . apply_filters( 'widget_title', $instance['title'] ) . $args['after_title'];
        }
 
        echo '<bittips-widget pay-tag="'.esc_html(get_option( 'bittips_tipjar_paytag')).'"></bittips-widget>';
 
        echo $args['after_widget'];
 
    }
 
    public function form( $instance ) {
 
        $title = ! empty( $instance['title'] ) ? $instance['title'] : esc_html__( '', 'text_domain' );
        ?>
        <p>
        <label for="<?php echo esc_attr( $this->get_field_id( 'title' ) ); ?>"><?php echo esc_html__( 'Title:', 'text_domain' ); ?></label>
            <input class="widefat" id="<?php echo esc_attr( $this->get_field_id( 'title' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'title' ) ); ?>" type="text" value="<?php echo esc_attr( $title ); ?>">
        </p>
        <?php
 
    }
 
    public function update( $new_instance, $old_instance ) {
 
        $instance = array();
 
        $instance['title'] = ( !empty( $new_instance['title'] ) ) ? strip_tags( $new_instance['title'] ) : '';
 
        return $instance;
    }
 
}
$bittips_tipjar_widget = new Bittips_TipJar_Widget();