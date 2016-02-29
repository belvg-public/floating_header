<?php 

class Belvg_FloatGridHeader_Model_Observer {

	public function controller_action_layout_render_before() {

		if (Mage::app()->getRequest()->getRequestedActionName() == 'index' && 
			($block = Mage::app()->getLayout()->getBlock('head'))
			) {
			// add grid js
			$block->addJs('belvg/grid/header.js');
		}

	}
}